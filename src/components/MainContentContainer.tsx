import React, { Component } from 'react';
import "../css/mainContentContainer.css";
import { Button, Alert } from 'reactstrap';

interface Props {
  range: string;
}

interface State {
  num1: number;
  num2: number;
  totalCounter: number;
  correctCounter: number;
  userInput: string;
  alertType: string;
  alertVisible: boolean;
  alertText: string;
}

class MainContentContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      num1: 0,
      num2: 0,
      totalCounter: 1,
      correctCounter: 0,
      userInput: "",
      alertType: "",
      alertVisible: false,
      alertText: ""
    };
  }

  inputOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ userInput: e.target.value });
  };

  getNewQuestion = (props: Props) => {
    const range = parseInt(props.range.slice(-3).trim());
    const num1 = Math.floor(Math.random() * range);
    const num2 = Math.floor(Math.random() * (range - num1));
    return {
      num1,
      num2,
      userInput: ""
    };
  };

  getSnapshotBeforeUpdate(prevProps: Props) {
    if (this.props.range !== prevProps.range) {
      return this.getNewQuestion(this.props);
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: State | null) {
    if (snapshot) {
      this.setState({
        num1: snapshot.num1,
        num2: snapshot.num2,
        userInput: snapshot.userInput
      });
    }
  }

  enterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.checkBtnOnClickHandler();
    }
  };

  checkBtnOnClickHandler = () => {
    const userInput = parseInt(this.state.userInput);
    const result = this.state.num1 + this.state.num2;
    const inputText = document.getElementById("userInput") as HTMLInputElement | null;
    this.setState((prevState) => ({
      ...this.getNewQuestion(this.props),
      totalCounter: prevState.totalCounter + 1,
      userInput: ""
    }));
    if (userInput === result) {
      this.setState((prevState) => ({
        correctCounter: prevState.correctCounter + 1,
        alertType: "success",
        alertVisible: true,
        alertText: "Correct!"
      }));
    } else {
      this.setState((prevState) => ({
        alertType: "danger",
        alertVisible: true,
        alertText: "Wrong!"
      }));
      if (inputText) inputText.select();
    }
    if (inputText) inputText.focus();
  };

  showAlert = () => {
    this.setState({ alertVisible: true }, () => {
      window.setTimeout(() => {
        this.setState({ alertVisible: false });
      }, 1000);
    });
  };

  render() {
    return (
      <div className="main-content-container">
        <div className="main-content-header">
          {this.props.range === ""
            ? (
              <div>
                <div>Hello Helen, are you ready to learn math?</div>
                <div>Click a category on the left to start! </div>
              </div>
            )
            : this.props.range}
        </div>
        <div>
          {this.props.range === "" ? "" : (
            <div className="main-content-content">
              <div className="question">
                <div>Question {this.state.totalCounter}:</div>
                <span>{this.state.num1} + {this.state.num2} = </span>
                <input
                  id="userInput"
                  onKeyPress={this.enterPressed}
                  border="0"
                  type="number"
                  value={this.state.userInput}
                  onChange={this.inputOnChangeHandler}
                />
                <Button
                  id="checkBtn"
                  color="primary"
                  size="lg"
                  onClick={this.checkBtnOnClickHandler}
                >
                  Check
                </Button>
              </div>
              <div className="correct-answer-counter">
                Correct answers: {this.state.correctCounter}
              </div>
              <Alert color={this.state.alertType} isOpen={this.state.alertVisible}>
                {this.state.alertText}
              </Alert>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MainContentContainer;