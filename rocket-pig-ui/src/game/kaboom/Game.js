import { useEffect } from "react";
import kaboom from "kaboom";

const Game = () => {
  useEffect(() => {
    const k = kaboom({
      global: false,
      width: 640,
      height: 480,
      canvas: document.getElementById("game-canvas"),
      clearColor: [0, 0, 0, 1],
    });

    k.scene("main", () => {
      k.add([
        k.text("Pozdrav iz Kabooma!", { size: 32 }),
        k.pos(160, 180),
      ]);
    });

    k.go("main");
  }, []);

  return <canvas id="game-canvas" />;
};

export default Game;
