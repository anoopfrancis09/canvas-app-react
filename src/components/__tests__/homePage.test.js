import { render, cleanup, fireEvent } from "@testing-library/react";
import { mount, configure, shallow } from "enzyme";
import React from "react";
import HomePage from "../homePage";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
// import renderer from "react-test-renderer";

configure({ adapter: new Adapter() });

afterEach(cleanup);
it("renders without  without crashing", () => {
  const div = document.createElement("div");
  render(<HomePage />, div);
});

it("renders the home page", () => {
  const component = shallow(<HomePage />);
  expect(component.find(".title").exists()).toBeTruthy();
});

it("Check if the image selection button is present", () => {
  const component = shallow(<HomePage />);
  expect(component.find(".actionItemContainer").exists()).toBeTruthy();
});

it("should call onChange on Image selection input", () => {
  const fileContents = "file contents";
  const readAsDataURL = jest.fn();
  const addEventListener = jest.fn((_, evtHandler) => {
    evtHandler();
  });

  const dummyFileReader = {
    addEventListener,
    readAsDataURL,
    result: fileContents,
  };
  window.FileReader = jest.fn(() => dummyFileReader);
  const file = new Blob([fileContents], { type: "image/jpeg" });

  const component = shallow(<HomePage />);
  expect(component.find(".imageSelector").exists()).toBeTruthy();

  component
    .find(".imageSelector")
    .simulate("change", { target: { files: { 0: file } } });
  expect(FileReader).toHaveBeenCalled();
});

it("check if the canvas is present or not", () => {
  const component = mount(<HomePage items={[]} />);

  expect(component.find(".canvas").exists()).toBeTruthy();
});

it("should call onChange on Image import input", () => {
  const fileContents = "file contents";
  const readAsText = jest.fn();
  const onload = Function;
  const addEventListener = jest.fn((_, evtHandler) => {
    evtHandler();
  });

  const dummyFileReader = {
    addEventListener,
    readAsText,
    onload,
    result: fileContents,
  };
  window.FileReader = jest.fn(() => dummyFileReader);
  const file = new Blob([fileContents], { type: "application/json" });

  const component = shallow(<HomePage />);
  expect(component.find(".imageImporter").exists()).toBeTruthy();

  component
    .find(".imageImporter")
    .simulate("change", { target: { files: { 0: file } } });
  expect(FileReader).toHaveBeenCalled();
});
