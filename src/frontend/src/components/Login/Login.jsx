import React, { useState } from "react";
import axios from "axios";
import "./Style.css";
import { useNavigate } from "react-router-dom";
import CCheckBox from "../SignUp/components/CCheckBox";

const Login = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();

    console.log("inputId", inputId);
    console.log("inputPw", inputPw);
  };

  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [loginFailCount, setLoginFailCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveIdCheck, setSaveIDFlag] = useState(false);
  const saveId = "saveId";

  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/");
  };
  const navigateToSignUp = () => {
    navigate("/sign-up");
  };
  const navigateToFindPw = () => {
    navigate("/findpw");
  };

  const oninputIdHandler = (e) => {
    if (saveIdCheck) {
      localStorage.getItem(saveId);
      setInputId(saveId);
    } else {
      setInputId(e.currentTarget.value);
    }
  };
  const oninputPwHandler = (e) => {
    setInputPw(e.currentTarget.value);
  };

  const onClickLogin = () => {
    if (loginFailCount >= 5) {
      setErrorMessage(
        "가능한 횟수를 초과하였습니다. 비밀번호를 재 설정 해주세요"
      );
      return;
    }
    console.log("click login");
    console.log("ID: ", inputId);
    console.log("PW: ", inputPw);
    axios
      .post("-로그인처리폼", null, {
        params: {
          user_id: inputId,
          user_pw: inputPw,
        },
      })
      .then((res) => {
        console.log(res);
        console.log("res.data.userId :: ", res.data.userId);
        console.log("res.data.msg :: ", res.data.msg);
        if (loginFailCount < 5) {
          if (res.data.userId == null || res.data.msg === null) {
            setLoginFailCount(loginFailCount + 1);
            setErrorMessage(
              `아이디 또는 비밀번호가 ${loginFailCount}회 틀렸습니다. 5회 도달시 비밀번호를 재설정 해야 합니다`
            );
            if (res.data.userId === null) {
              setErrorMessage("존재하지 않는 계정입니다.");
            } else if (res.data.msg === null) {
              setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
          } else if (res.data.userId === inputId) {
            // 로그인 성공: 실패 횟수를 0으로 초기화
            setLoginFailCount(0);
            sessionStorage.setItem("user_id", inputId);
            document.location.href = "/";
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSaveIDFlag = (e) => {
    setSaveIDFlag(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem(saveId, inputId);
    } else {
      localStorage.setItem(saveId, "");
    }
    console.log(e.target.checked, localStorage);
  };

  return (
    <div className="page">
      <form className="form" onSubmit={onSubmitHandler}>
        <label className="coala" onClick={navigateToHome}>
          COALA
        </label>
        <div className="idBox">
          <label className="text">아이디</label>
          <input
            type="id"
            className="input"
            value={inputId}
            onChange={oninputIdHandler}
            placeholder="아이디"
          />
        </div>
        <div className="pwBox">
          <label className="text">비밀번호</label>
          <input
            type="password"
            className="input"
            value={inputPw}
            onChange={oninputPwHandler}
            placeholder="비밀번호"
          />
        </div>
        <div>
          <CCheckBox
            text={"아이디 저장"}
            checked={saveIdCheck}
            onChange={handleSaveIDFlag}
          />
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <button className="button" type="button" onClick={onClickLogin}>
          로그인
        </button>
        <div className="afterlogin">
          <label className="grey" onClick={navigateToSignUp}>
            회원가입
          </label>
          <label className="ho">|</label>
          <label className="grey" onClick={navigateToFindPw}>
            비밀번호 찾기
          </label>
        </div>
      </form>
    </div>
  );
};

export default Login;
