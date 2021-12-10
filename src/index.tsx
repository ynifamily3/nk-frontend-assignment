import React, { MouseEventHandler, useState } from "react";
import ReactDOM from "react-dom";
import { upload } from "./repository/api";
import { v1 as uuidv1 } from "uuid";

type Video = {
  id: string;
  status: "uploading" | "done";
  fileName: string;
};

const initialState: Video[] = [];

function App() {
  const [fileName, setFileName] = useState(`${uuidv1()}.mp4`);
  const [state, setState] = useState(initialState);

  const handleRegister: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const id = uuidv1(); // 임의의 중복되지 않는 id를 생성
    // state에 새로운 영상을 추가하고, status를 uploading으로 설정한다.
    setState([
      ...state,
      {
        id,
        status: "uploading",
        fileName,
      },
    ]);
    // 다음 검수 대상인 영상의 새로운 파일 이름을 지정한다.
    setFileName(`${uuidv1()}.mp4`);
    // 업로드하고 나서 해당 영상을 찾아 상태를 done으로 변경한다.
    upload().then(() => {
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
          <h3>동영상 검수</h3>
          <strong>동영상 {fileName}</strong>
          <button onClick={handleRegister}>등록</button>
          <ul>
            {state.map((video) => (
              <li key={video.id}>
                <span>
                  <strong>{video.fileName}</strong>
                  {video.status === "uploading"
                    ? " 업로드 중... "
                    : " 업로드 완료"}
                </span>
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
