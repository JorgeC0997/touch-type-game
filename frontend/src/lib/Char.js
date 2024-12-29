export default class Char {
  defaultTxt = {
    marginLeft: "2px",
    marginRight: "2px",
    paddingLeft: "2px",
    paddingRight: "2px",
    color: "#CAD2C5",
  };

  active = {
    marginLeft: "2px",
    marginRight: "2px",
    paddingLeft: "2px",
    paddingRight: "2px",
    color: "#0081d6",
    textDecoration: "underline",
    textDecorationColor: "#0081d6",
  };

  correct = {
    marginLeft: "2px",
    marginRight: "2px",
    paddingLeft: "2px",
    paddingRight: "2px",
    color: "#fff",
    // backgroundColor: "rgba(159, 202, 131, 0.2)",
    textDecoration: "underline",
    textDecorationColor: "rgb(159, 202, 131)",
    backgroundImage:
      "linear-gradient(rgba(159, 202, 131, 0), rgba(159, 202, 131, 0.2))",
  };

  incorrect = {
    marginLeft: "2px",
    marginRight: "2px",
    paddingLeft: "2px",
    paddingRight: "2px",
    color: "#fff",
    backgroundColor: "rgba(202, 131, 131, 0.2)",
    textDecoration: "underline",
    textDecorationColor: "rgb(202, 131, 131)",
  };

  constructor(character, charState) {
    this.character = character;
    this.charState = charState;
  }

  getStyle(currentPointer, charIndex) {
    if (currentPointer == charIndex) {
      return this.active;
    } else if (this.charState == true) {
      return this.correct;
    } else if (this.charState == false) {
      return this.incorrect;
    } else if (this.charState == undefined) {
      return this.defaultTxt;
    }
  }
}
