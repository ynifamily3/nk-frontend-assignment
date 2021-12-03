import React, { MouseEventHandler, useState } from "react";
import ReactDOM from "react-dom";
import { upload } from "./repository/api";
import { v1 as uuidv1 } from "uuid";

type Video = {
  id: string;
  status: "uploading" | "done";
  fileName: string;
  progress: number;
};

const initialState: Video[] = [];

function App() {
  const [fileName, setFileName] = useState(`${uuidv1()}.mp4`);
  const [state, setState] = useState(initialState);

  const handleRegister: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const id = uuidv1();
    setState([
      ...state,
      {
        id,
        status: "uploading",
        fileName,
        progress: 0,
      },
    ]);

    // generate random file name
    setFileName(`${uuidv1()}.mp4`);

    upload((progress: number) => {
      setState(
        state.map((video) =>
          video.id === id
            ? {
                ...video,
                progress: progress,
              }
            : video
        )
      );
    }).then(() => {
      setState(
        state.map((video) =>
          video.id === id
            ? {
                ...video,
                status: "done",
              }
            : video
        )
      );
    });
  };

  return (
    <div>
      <h2>동영상 검수</h2>
      <article
        style={{
          width: "800px",
          display: "flex",
          gap: 16,
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
          }}
        >
          <h3>동영상 올리기</h3>
          <strong>동영상 {fileName}</strong>
          <button onClick={handleRegister}>등록</button>
          <ul>
            {state.map((article) => (
              <li key={article.id}>
                <span>
                  {article.status === "uploading"
                    ? " 업로드 중... "
                    : "업로드 완료"}
                </span>
                <progress
                  value={article.progress}
                  max="100"
                  style={{
                    width: "100%",
                  }}
                />
              </li>
            ))}
          </ul>
        </form>
      </article>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
