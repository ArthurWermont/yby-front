import moment from "moment";
import qs from "qs";
import type { IContext } from "../reports/context";
import { BaseService } from "./Base.service";

interface ReportParams {
  documentId?: string;
  managerClientIds?: string[];
  isManager?: boolean;
  page: number;
  limit?: number;
  isAdmin?: boolean;
  search: IContext["search"];
}

interface Meta {
  pagination: {
    limit: number;
    start: number;
    total: number;
  };
}

class ReportService extends BaseService {
  async getData(params: ReportParams): Promise<{ data: any[]; meta: Meta }> {
    try {
      const {
        documentId = "",
        managerClientIds = [],
        isManager = false,
        isAdmin = false,
        page,
        limit = 50,
        search,
      } = params;

      if (page - 1 < 0) {
        throw new Error("Página inválida. O valor deve ser maior que zero.");
      }

      const filters: any = {};
      const queryParams: any = {
        populate: "*",
        filters,
        pagination: {
          start: (+page - 1) * limit,
          limit: limit,
        },
        sort: [`collection_date:${search.sortByDate || "desc"}`],
      };

      if (!isAdmin) {
        if (isManager) {
          const selectedClient = search.selectedClient || "";

          if (!selectedClient) {
            filters["client"] = {
              documentId: {
                $in: managerClientIds,
              },
            };
          } else {
            if (!managerClientIds.includes(selectedClient)) {
              throw new Error("Cliente não permitido para este gestor.");
            }

            filters["$or"] = [
              {
                client: {
                  documentId: {
                    $eq: selectedClient,
                  },
                },
              },
            ];

            const cnpjs = await this.getClientsCNPJ(selectedClient);

            if (cnpjs.length > 0) {
              filters["$or"].push({
                client: {
                  cnpj: {
                    $in: cnpjs,
                  },
                },
              });
            }
          }
        } else {
          filters["$or"] = [
            {
              client: {
                documentId: {
                  $eq: documentId,
                },
              },
            },
          ];

          const cnpjs = await this.getClientsCNPJ(documentId);

          if (cnpjs.length > 0) {
            filters["$or"].push({
              client: {
                cnpj: {
                  $in: cnpjs,
                },
              },
            });
          }
        }
      }

      if (search) {
        const searchFilters = this.buildSearchFilters(search);
        Object.assign(filters, searchFilters);
      }

      const queryString = qs.stringify(queryParams, {
        encodeValuesOnly: true,
        arrayFormat: "indices",
      });

      const { data } = await this.api.get(`/collections?${queryString}`);
      return data;
    } catch (error) {
      console.error("Erro ao buscar os dados do relatório:", error);
      throw error;
    }
  }

  private async getClientsCNPJ(documentId: string): Promise<string[]> {
    try {
      const {
        data: { data },
      } = await this.api.get(`/clients/${documentId}`);

      const clients = data?.clients;

      if (Array.isArray(clients)) {
        return clients.map((client) => String(client).trim()).filter(Boolean);
      }

      if (typeof clients === "string" && clients.trim()) {
        return [clients.trim()];
      }

      return [];
    } catch (error) {
      throw new Error("Erro ao buscar o clientes CNPJ");
    }
  }

  private buildSearchFilters(search: IContext["search"]): any {
    const filters: any = {};

    if (search.pev) {
      (filters.$and ||= []).push({
        client: {
          social_name: {
            $contains: search.pev,
          },
        },
      });
    }

    if (search.cooperative) {
      (filters.$and ||= []).push({
        cooperative: {
          documentId: {
            $eq: search.cooperative,
          },
        },
      });
    }

    if (search.startDate && search.endDate) {
      (filters.$and ||= []).push({
        collection_date: {
          $gte: moment(search.startDate).startOf("day").toISOString(),
          $lte: moment(search.endDate).endOf("day").toISOString(),
        },
      });
    }

    if (search.waste) {
      (filters.$and ||= []).push({
        wastes: {
          name: {
            $contains: search.waste,
          },
        },
      });
    }

    return filters;
  }
}

export const reportService = new ReportService();
