import styled from "styled-components";

export const Styles = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  height: calc(100vh - 50px);

  padding: 50px 40px 0;
  overflow: hidden;
  gap: 30px;

  #header {
    display: flex;
    flex-direction: column;
  }

  #filters {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  #exports {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
  }
`;
