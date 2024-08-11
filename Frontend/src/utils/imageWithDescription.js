import React, { useEffect, useRef, useState } from "react";

const ImageWithDescription = ({ src, description, onImageProcessed }) => {
  const canvasRef = useRef(null);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (!isProcessed && src && description) {
      const image = new Image();
      const logo = new Image();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const finalSize = 400; // Fixed output size

      logo.onload = () => {
        image.onload = () => {
          // Set canvas size to final size
          canvas.width = finalSize;
          canvas.height = finalSize;

          // Draw white background
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Determine cropping dimensions
          const cropWidth = Math.min(image.width, finalSize);
          const cropHeight = Math.min(image.height, finalSize);
          const cropX = (image.width - cropWidth) / 2;
          const cropY = (image.height - cropHeight) / 2;

          // Draw the cropped image centered in the final canvas
          ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            (finalSize - cropWidth) / 2,
            (finalSize - cropHeight) / 2,
            cropWidth,
            cropHeight
          );

          // Draw the description below the image
          ctx.fillStyle = "black";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";

          // Split description into lines
          const words = description.split(" ");
          const lines = ["", "", "", ""];
          let lineIndex = 0;

          words.forEach((word) => {
            const testLine = lines[lineIndex] + word + " ";
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > finalSize && lineIndex < 3) {
              lineIndex++;
            }
            lines[lineIndex] += word + " ";
          });

          // Draw each line of the description
          lines.forEach((line, index) => {
            ctx.fillText(
              line.trim(),
              finalSize / 2,
              finalSize - 120 + (index + 1) * 16 + 10
            );
          });

          // Calculate position for "Powered by" and logo
          const poweredByText = "Powered by";
          const poweredByWidth = ctx.measureText(poweredByText).width;
          const logoScale = 0.2; // Scale of the logo
          const totalWidth = poweredByWidth + logo.width * logoScale + 10;

          // Draw "Powered by" text
          ctx.fillText(
            poweredByText,
            (finalSize - totalWidth) / 2 + poweredByWidth / 2,
            finalSize - 20
          );

          // Draw the logo next to "Powered by" text
          ctx.drawImage(
            logo,
            (finalSize - totalWidth) / 2 + poweredByWidth + 10,
            finalSize - 35,
            logo.width * logoScale,
            logo.height * logoScale
          );

          // Draw the border around the canvas
          const borderWidth = 4; // Width of the border
          ctx.fillStyle = "#16a34a"; // TailwindCSS green600

          // Draw the border around the canvas
          ctx.fillRect(0, 0, finalSize, borderWidth); // Top border
          ctx.fillRect(0, 0, borderWidth, finalSize); // Left border
          ctx.fillRect(finalSize - borderWidth, 0, borderWidth, finalSize); // Right border
          ctx.fillRect(0, finalSize - borderWidth, finalSize, borderWidth); // Bottom border

          // Convert cropped canvas to File
          canvas.toBlob((blob) => {
            const file = new File([blob], "image_with_description.png", {
              type: "image/png",
            });
            if (onImageProcessed) {
              onImageProcessed(file);
              setIsProcessed(true);
            }
          }, "image/png");
        };
        image.src = src;
        image.crossOrigin = "Anonymous";
      };
      logo.src = "/logoBlack.png";
    }
  }, [src, description, onImageProcessed, isProcessed]);

  return <canvas ref={canvasRef} style={{ display: "none" }}></canvas>;
};

export default ImageWithDescription;
