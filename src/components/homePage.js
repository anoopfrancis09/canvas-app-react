/* eslint-disable no-fallthrough */
import React, { useEffect, useRef, useState } from "react";

import { canvasHeight, canvasWidth } from "../constants";

function HomePage() {
  const canvas = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const imgWidth = useRef(0);
  const imgHeight = useRef(0);
  const imgX = useRef(0);
  const imgY = useRef(0);
  const imageData = useRef(null);
  const ctxCopy = useRef(null);

  let isDown = false;
  let startX;
  let startY;

  useEffect(() => {
    offsetX.current = canvasOffset.left;
    offsetY.current = canvasOffset.top;
  }, [canvasOffset]);

  useEffect(() => {
    if (scaleFactor) {
      scaleImageOnCanvas();
    }
  }, [scaleFactor]);

  const onMouseMove = (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const mouseX = parseInt(e.clientX - offsetX.current);
    const mouseY = parseInt(e.clientY - offsetY.current);

    // Put your mousemove stuff here
    if (!isDown) {
      return;
    }

    imgX.current += mouseX - startX;
    imgY.current += mouseY - startY;

    if (imgX.current > 0) {
      imgX.current = 0;
    }

    if (imgY.current > 0) {
      imgY.current = 0;
    }

    if (Math.abs(imgX.current) + canvasWidth > imgWidth.current) {
      imgX.current = -(imgWidth.current - canvasWidth);
    }

    if (Math.abs(imgY.current) + canvasHeight > imgHeight.current) {
      imgY.current = -(imgHeight.current - canvasHeight);
    }

    startX = mouseX;
    startY = mouseY;
    reDrawImageOnCanvas();
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    startX = parseInt(e.clientX - offsetX.current);
    startY = parseInt(e.clientY - offsetY.current);

    if (
      startX >= imgX.current &&
      startX <= imgX.current + imgWidth.current &&
      startY >= imgY.current &&
      startY <= imgY.current + imgHeight.current
    ) {
      isDown = true;
    }
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    isDown = false;
  };

  const onMouseOut = (e) => {
    e.preventDefault();
    isDown = false;
  };

  const reDrawImageOnCanvas = () => {
    if (ctxCopy && selectedImage) {
      ctxCopy.current.clearRect(0, 0, canvas.width, canvas.height);
      ctxCopy.current.drawImage(selectedImage, imgX.current, imgY.current);
    }
  };

  const scaleImageOnCanvas = () => {
    ctxCopy.current.clearRect(0, 0, canvas.width, canvas.height);

    if (scaleFactor !== 1) {
      ctxCopy.current.save();
      ctxCopy.current.scale(scaleFactor, scaleFactor);
    } else ctxCopy.current.restore();

    ctxCopy.current.drawImage(selectedImage, imgX.current, imgY.current);
  };

  const onClick = (e) => {
    switch (e.detail) {
      case 1:
        return;
      case 2:
        imgX.current = -(selectedImage.width / 2 - canvasWidth / 2);
        imgY.current = -(selectedImage.height / 2 - canvasHeight / 2);
        reDrawImageOnCanvas();
        break;
      case 3:
        return;
      default:
        return;
    }
  };

  const resetAllData = () => {
    imgX.current = null;
    imgY.current = null;
  };

  const onFileChange = (e) => {
    const editorCanvas = canvas.current;
    resetAllData();
    // get all selected Files
    const files = e.target.files;

    Object.keys(files).forEach((key) => {
      if (key === "0") {
        let file = files[key];

        // check if file is valid Image (just a MIME check)
        // eslint-disable-next-line default-case
        switch (file.type) {
          case "image/jpeg":
          case "image/png":
          case "image/gif":
            // read Image contents from file
            const reader = new FileReader();
            reader.onload = function (e) {
              const canvasElement = document.getElementById("editorCanvas");
              setCanvasOffset(canvasElement.getBoundingClientRect());
              const img = new Image();
              imageData.current = reader.result;
              img.src = reader.result;

              img.onload = function () {
                imgX.current = -(img.width / 2 - canvasWidth / 2);
                imgY.current = -(img.height / 2 - canvasHeight / 2);
                setSelectedImage(img);
                imgHeight.current = img.height;
                imgWidth.current = img.width;

                editorCanvas.width = canvasWidth;
                editorCanvas.height = canvasHeight;

                const ctx = editorCanvas.getContext("2d");
                ctxCopy.current = ctx;

                //Scale the image to fit the canvas only if the image size is lesser than canvas
                var xScale =
                  img.width < canvas.current.width
                    ? canvas.current.width / img.width
                    : 1;
                let yScale =
                  img.height < canvas.current.height
                    ? canvas.current.height / img.height
                    : 1;

                // get the top left position of the image
                var x = canvas.current.width / 2 - (img.width / 2) * xScale;
                var y = canvas.current.height / 2 - (img.height / 2) * yScale;

                ctx.drawImage(
                  img,
                  x,
                  y,
                  img.width * xScale,
                  img.height * yScale
                );
                // ctx.drawImage(img, imgX.current, imgY.current);
              };
            };
            reader.readAsDataURL(file);
        }
      }
    });
  };

  const onScaleClick = (scalePercent) => {
    setScaleFactor(scalePercent / 100);
  };

  const onUpload = () => {
    const data = {
      canvas: {
        scaleFactor: scaleFactor,
        width: canvasWidth,
        height: canvasWidth,
        photo: {
          x: imgX.current,
          y: imgY.current,
          height: selectedImage.height,
          width: selectedImage.width,
          id: "imagetestId",
          imageData: imageData.current,
        },
      },
    };
    saveJSONFile(data);
  };

  const saveJSONFile = (jsonData) => {
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "image_data.json";
    link.href = url;
    link.click();
  };

  const onImport = (e) => {
    const editorCanvas = canvas.current;
    resetAllData();
    // get all selected Files
    const files = e.target.files;

    Object.keys(files).forEach((key) => {
      if (key === "0") {
        let file = files[key];

        // check if file is valid Image (just a MIME check)
        // eslint-disable-next-line default-case
        switch (file.type) {
          case "application/json":
            const reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = function (e) {
              const storedImageData = JSON.parse(e.target.result);
              const canvasElement = document.getElementById("editorCanvas");
              setCanvasOffset(canvasElement.getBoundingClientRect());
              const img = new Image();
              img.src = storedImageData.canvas.photo.imageData;
              imageData.current = storedImageData.canvas.photo.imageData;

              img.onload = function () {
                imgX.current = storedImageData.canvas.photo.x;
                imgY.current = storedImageData.canvas.photo.y;
                setSelectedImage(img);
                imgHeight.current = storedImageData.canvas.photo.height;
                imgWidth.current = storedImageData.canvas.photo.width;

                editorCanvas.width = canvasWidth;
                editorCanvas.height = canvasHeight;

                const ctx = editorCanvas.getContext("2d");
                // ctx.scale(
                //   storedImageData.canvas.scaleFactor,
                //   storedImageData.canvas.scaleFactor
                // );
                ctxCopy.current = ctx;

                ctx.drawImage(
                  img,
                  imgX.current,
                  imgY.current,
                  img.width,
                  img.height
                );

                setScaleFactor(storedImageData.canvas.scaleFactor);
              };
            };
            return null;
        }
      }
    });
  };

  return (
    <div className="App">
      <h1 data-testid="titleId">Canvas</h1>
      <div className="actionContainer">
        <div
          data-testid="imageSelectionInputId"
          className="actionItemContainer"
        >
          <label className="custom-file-upload">
            <input
              type="file"
              id="fileSelector"
              accept="image/*"
              onChange={onFileChange}
            />
            Select an Image file
          </label>
        </div>
        <div className="actionItemContainer">
          <label className="custom-file-upload">
            <input type="file" onChange={onImport} />
            Click to upload image
          </label>
        </div>
        {selectedImage ? (
          <div className="actionItemContainer">
            <label>Scale</label>
            <button
              disabled={scaleFactor === 1}
              type="button"
              className="button"
              id="myBtn"
              onClick={(e) => onScaleClick(100)}
            >
              100%
            </button>
            <button
              disabled={scaleFactor === 2}
              type="button"
              className="button"
              id="myBtn"
              onClick={(e) => onScaleClick(200)}
            >
              200%
            </button>
          </div>
        ) : null}
      </div>

      {selectedImage ? (
        <>
          <button
            className="button"
            type="button"
            id="myBtn"
            onClick={onUpload}
          >
            Upload Image
          </button>
        </>
      ) : null}
      {selectedImage ? (
        <div className="messagesContainer">
          <label className="messages" id="messagesLabel">
            **Drag the image to position it on the canvas area.
          </label>
          <label className="messages" id="messagesLabel">
            **Double click on the image to position it center on the canvas
            area.
          </label>
        </div>
      ) : null}
      <canvas
        className="canvas"
        ref={canvas}
        id="editorCanvas"
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseOut}
        onClick={onClick}
      ></canvas>
    </div>
  );
}

export default HomePage;
