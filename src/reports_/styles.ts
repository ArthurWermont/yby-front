import styled from "styled-components";

export const Styles = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  flex: 1;
  /* width: 100%; */
  /* height: 100%; */

  padding: 50px 40px 0;

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
