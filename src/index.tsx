import React, { MouseEventHandler, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { uploadFile } from "./repository/api";
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";

interface Article {
  id: string;
  title: string;
  uploader: string;
  video: Video;
}

type Video = {
  status: "uploading" | "done";
  fileName: string;
  progress: number;
};

const initialState: Article[] = [];

function App() {
  const [state, setState] = useState(initialState);
  const titleRef = useRef<HTMLInputElement>(null);
  const uploaderRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleRegister: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const title = (
      titleRef.current!.value ? titleRef.current!.value : `제목_${uuidv1()}`
    ).slice(0, 8);
    const uploader = (
      uploaderRef.current!.value
        ? titleRef.current!.value
        : `업로더_${uuidv1()}`
    ).slice(0, 8);
    const file = fileRef.current!.files![0];
    const fileName = !file ? `dummy_${uuidv1()}.mp4` : file.name;

    setState([
      ...state,
      {
        id,
        title,
        uploader,
        video: {
          status: "uploading",
          fileName: fileName,
          progress: 0,
        },
      },
    ]);
    uploadFile(file, (progress: number) => {
      setState(
        state.map((article) =>
          article.id === id
            ? {
                ...article,
                video: {
                  ...article.video,
                  progress,
                },
              }
            : article
        )
      );
    }).then(() => {
      setState(
        state.map((article) =>
          article.id === id
            ? {
                ...article,
                video: {
                  ...article.video,
                  status: "done",
                },
              }
            : article
        )
      );
    });
  };

  return (
    <div>
      <h2>동영상 검수</h2>
      <article
        style={{
          display: "flex",
          gap: 16,
          backgroundColor: "aliceblue",
          width: 400,
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h3>동영상 올리기</h3>
          <input
            type="text"
            placeholder="제목"
            style={{ width: 300 }}
            ref={titleRef}
          />
          <input
            type="text"
            placeholder="업로더"
            style={{ width: 300 }}
            ref={uploaderRef}
          />
          <strong>동영상</strong>
          <input type="file" style={{ width: 300 }} ref={fileRef} />
          <button onClick={handleRegister}>등록</button>
          <ul>
            {state.map((article) => (
              <li key={article.id}>
                <strong>[{article.title}]</strong>
                <span> - {article.uploader}</span>
                <span>
                  {article.video.status === "uploading"
                    ? " 업로드 중..."
                    : "완료"}
                </span>
                <progress
                  value={article.video.progress}
                  max="100"
                  style={{ width: 300 }}
                />
                <span>{article.video.fileName}</span>
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
