import styled from 'styled-components'

export const Box = styled.div`
  margin: 3rem;
  padding:1rem;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  flex-wrap: wrap;
  > div {
    padding: .5rem
  }
  > h1 {
    flex: 0 0 100%;
    margin-bottom: 0;
    font-weight: 500;
  }
  > h1 + div {
    flex: 0 0 75%
  }
  > div:last-child {
    flex: 0 0 25%
  }
`

export default Box