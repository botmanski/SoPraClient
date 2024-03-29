import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Edit extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      username: null,
      birthDay: null,
      name: null,
      id: null,
    };
  }

  goToProfile() {
    this.props.history.push(`/game`);
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async edit() {
    try {
      const requestBody = JSON.stringify({
        name: this.state.name,
        username: this.state.username,
        birthDay: this.state.birthDay
      });
      console.log(requestBody);
      const id = this.state.id;
      const response = await api.put('/users/' + id, requestBody);
      this.props.history.push({
        pathname: '/profile',
        state: { id }
      });
    } catch (error) {
      alert(`Something went wrong during the edit: \n${handleError(error)}`);
    }
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    const requestBody = JSON.stringify({
      token: token
    });
    const response = await api.post('/token', requestBody);
    console.log(response.data);
    this.setState({
      name: response.data.name,
      username: response.data.username,
      birthDay: response.data.birthDay,
      id: response.data.id
    })
  }

  render() {
    return (
      <BaseContainer>
        <FormContainer>
          <Form>
            <Label>name</Label>
            <InputField
              value={this.state.name}
              onChange={e => {
                this.handleInputChange('name', e.target.value);
              }}
            />
            <Label>username</Label>
            <InputField
              value={this.state.username}
              onChange={e => {
                this.handleInputChange('username', e.target.value);
              }}
            />
            <Label>Birthday</Label>
            <InputField
              value={this.state.birthDay}
              onChange={e => {
                this.handleInputChange('birthDay', e.target.value);
              }}
            />
            <ButtonContainer>
              <Button
                disabled={!this.state.username || !this.state.name || !this.state.birthDay}
                width="50%"
                onClick={() => {
                  this.edit();
                }}
              >
                Edit
              </Button>
              <Button
                width="50%"
                onClick={() => {
                  this.goToProfile();
                }}
              >
                Game
              </Button>
            </ButtonContainer>
          </Form>
        </FormContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Edit);
