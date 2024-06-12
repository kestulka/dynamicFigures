import React, { useEffect, useState } from "react";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";
import axios from "axios";
import styles from "./Square.module.css";

const Square = () => {
  const pixelToMeterRatio = 0.01; // Example: 1 pixel = 0.01 meters

  const [boxName, setBoxName] = useState("");
  const [squareId, setSquareId] = useState("");
  const [dimensions, setDimensions] = useState({
    width: 200,
    height: 200,
    x: (window.innerWidth - 200) / 2,
    y: (window.innerHeight - 600) / 2,
  });

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = 650; // max width in pixels
      const maxHeight = 800; // max height in pixels

      setDimensions((prevDimensions) => {
        const width = Math.min(prevDimensions.width, maxWidth);
        const height = Math.min(prevDimensions.height, maxHeight);
        return { ...prevDimensions, width, height };
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onResize = (event, { size }) => {
    setDimensions((prevDimensions) => ({
      ...prevDimensions,
      width: size.width,
      height: size.height,
    }));
  };

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    setDimensions((prevDimensions) => ({
      ...prevDimensions,
      x,
      y,
    }));
  };

  const convertToMeters = (pixels) => pixels * pixelToMeterRatio;

  const sendToDatabase = () => {
    axios
      .post("http://localhost:3003/square", {
        left_border: convertToMeters(dimensions.height),
        top_border: convertToMeters(dimensions.width),
        right_border: convertToMeters(dimensions.height),
        bottom_border: convertToMeters(dimensions.width),
        x_coord: convertToMeters(dimensions.x),
        y_coord: convertToMeters(dimensions.y),
      })
      .then((res) => {
        console.log("Data pushed");
      })
      .catch((err) => console.error(err));
  };

  const getSquareById = (id) => {
    axios
      .get(`http://localhost:3003/square/${id}`)
      .then((res) => {
        const squareData = res.data;
        setDimensions({
          width: squareData.top_border / pixelToMeterRatio,
          height: squareData.left_border / pixelToMeterRatio,
          x: squareData.x_coord / pixelToMeterRatio,
          y: squareData.y_coord / pixelToMeterRatio,
        });
      })
      .catch((err) => {
        console.error("Error fetching square data:", err);
      });

    setSquareId("");
  };

  const { width, height, x, y } = dimensions;

  return (
    <div>
      <div className={styles.capacityDisplay}>
        Capacity: {(width * height * Math.pow(pixelToMeterRatio, 2)).toFixed(2)}{" "}
        m²
      </div>
      <Draggable
        handle=".handle"
        position={{ x: dimensions.x, y: dimensions.y }}
        onDrag={handleDrag}
      >
        <ResizableBox
          width={dimensions.width}
          height={dimensions.height}
          onResize={onResize}
          resizeHandles={["se", "e", "s"]}
          minConstraints={[100, 100]}
          className={styles.boxContainer}
          maxConstraints={[800, 650]}
        >
          <div className={`${styles.handle} handle`}>
            <div className={styles.widthDisplay}>
              Width: {(width * pixelToMeterRatio).toFixed(2)} m
            </div>
            <div className={styles.heightDisplay}>
              Height: {(height * pixelToMeterRatio).toFixed(2)} m
            </div>
          </div>
        </ResizableBox>
      </Draggable>
      <div className={styles.controlPanel}>
        <button className={styles.button} onClick={sendToDatabase}>
          Save to DB
        </button>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter database figure ID "
          value={squareId}
          onChange={(e) => setSquareId(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => getSquareById(squareId)}
        >
          Load from DB
        </button>
      </div>
    </div>
  );
};

export default Square;
