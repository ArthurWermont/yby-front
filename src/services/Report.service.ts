import qs from "qs";
import type { IContext } from "../reports_/context";
import { BaseService } from "./Base.service";

interface ReportParams {
  documentId?: string;
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
        sort: [`createdAt:${search.sortByDate || "desc"}`],
      };

      if (!isAdmin) {
        filters["$or"] = [{ client: { documentId: { $eq: documentId } } }];

        const cnpjs = await this.getClientsCNPJ(documentId);
        cnpjs?.forEach((cnpj) => {
          filters["$or"].push({ client: { cnpj: { $in: cnpj } } });
        });
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

      return data.clients;
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

    if (search.startDate && search.endDate) {
      (filters.$and ||= []).push({
        createdAt: {
          $gte: search.startDate,
          $lte: search.endDate,
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
