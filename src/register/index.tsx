import { ToggleButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled as styledComponents } from "styled-components";
import ClientForm from "./client-form";
import CooperativeForm from "./cooperative-form";
import BasicTable from "./users-form";

const StyledContainer = styledComponents.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
    width: 100%;
`;

const StyledCenterContainer = styledComponents.div`
    padding: 50px 40px 0;
`;

export default function Register({ type }: { type: string }) {
  const navigate = useNavigate();

  const [value, setValue] = useState(0);

  const handleChange = (newValue: number) => {
    if (newValue === 0) {
      navigate("/cadastro/cliente");
    }
    if (newValue === 1) {
      navigate("/cadastro/cooperativa");
    }
    setValue(newValue);
    if(newValue===2){
      navigate("/cadastro/users");
    }
  };

  useEffect(() => {
    if (type === "cliente") {
      setValue(0);
    }
    if (type === "cooperativa") {
      setValue(1);
    }
    if(type ==="users"){
      setValue(2);
    }

  }, [type]);

  return (
    <StyledContainer>
      <StyledCenterContainer>
        <Typography
          style={{ fontSize: "32px", fontWeight: "600", color: "#4B3838" }}
        >
          Cadastro
        </Typography>

        <div
          style={{
            display: "flex",
            width: "280px",
            gap: "4px",
            marginTop: "18px",
            marginBottom: "22px",
          }}
        >
          <ToggleButton
            style={{
              backgroundColor:
                value === 0 ? "#15853B" : "rgb(200, 200, 200, 0.5)",
              flex: 1,
              height: "36px",
              border: "0px",
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              color: value === 0 ? "white" : "#15853B",
            }}
            value="clientw"
            selected={value === 0}
            onChange={() => handleChange(0)}
          >
            CLIENTE
          </ToggleButton>
          <ToggleButton
            style={{
              backgroundColor:
                value === 1 ? "#15853B" : "rgb(200, 200, 200, 0.5)",
              flex: 1,
              height: "36px",
              border: "0px",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              color: value === 1 ? "white" : "#15853B",
            }}
            value="cooperativa"
            selected={value === 1}
            onChange={() => handleChange(1)}
          >
            COOPERATIVA
          </ToggleButton>
          <ToggleButton
            style={{
              backgroundColor:
                value === 2 ? "#15853B" : "rgb(200, 200, 200, 0.5)",
              flex: 1,
              height: "36px",
              border: "0px",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              color: value === 2 ? "white" : "#15853B",
            }}
            value="users"
            selected={value === 2}
            onChange={() => handleChange(2)}
          >
            USUÁRIOS
          </ToggleButton>
        </div>
        {value === 0 && <ClientForm />}
        {value === 1 && <CooperativeForm />}
        {value === 2 &&<BasicTable/>}
      </StyledCenterContainer>
    </StyledContainer>
  );
}
