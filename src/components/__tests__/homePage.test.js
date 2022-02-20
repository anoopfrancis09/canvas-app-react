import { render, cleanup } from "@testing-library/react";
import React from "react";
import HomePage from "../homePage";
import renderer from "react-test-renderer";
// import "jest-dom/extend-expect";

afterEach(cleanup);
it("renders without  without crashing", () => {
  const div = document.createElement("div");
  render(<HomePage />, div);
});

it("renders the home page", () => {
  const div = document.createElement("div");
  const { getByTestId } = render(<HomePage />, div);

  expect(getByTestId("titleId")).toHaveTextContent("Canvas");
});

it("Check if the image selection button is present", () => {
  const div = document.createElement("div");
  const { getByTestId } = render(<HomePage />, div);

  expect(getByTestId("imageSelectionInputId")).toHaveTextContent(
    "Select an Image file"
  );
});

it("matches snapshot", () => {
  const tree = renderer.create(<HomePage />).toJSON();

  expect(tree).toMatchSnapshot();
});
