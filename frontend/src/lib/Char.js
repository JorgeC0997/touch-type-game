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
    // Character to be displayed in exercise text
    this.character = character;
    // The state that will determine the style of the char
    // it can be true, false or undefined
    // PracticeRoom will set all Char objects to undefined based on an array of boolean characters
    this.charState = charState;
  }

  // this will return the styles for Char object
  getStyle(currentPointer, charIndex) {
    // if currentPointer and charIndex are equal it means that
    // this char will be the active char to be typed by the user
    if (currentPointer == charIndex) {
      return this.active;
    } else if (this.charState == true) {
      // return correct if char was typed correctly
      return this.correct;
    } else if (this.charState == false) {
      // return incorrect if char was not typed correctly
      return this.incorrect;
    } else if (this.charState == undefined) {
      // return defaultTxt if char is not ready to be typed
      return this.defaultTxt;
    }
  }
}
