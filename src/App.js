import React, { useState, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import OTPInput from "otp-input-react";
import axios from "axios";
import lineNoti from "./line-notify.png";
import "./App.css";

function App() {
  return (
    <Router>
      <Route exact path="/lineNotify" component={LineNotify} />
      <Route exact path="/register" component={Register} />
    </Router>
  );
}

function sendMessage(msg, setIsLoading, setMessage, setExMsg) {
  return setTimeout(
    () =>
      axios
        .post("http://localhost:8000/sendMessage", { msg })
        .then(function(response) {
          setIsLoading(false);
          setExMsg(msg);
          setMessage("");
        })
        .catch(function(error) {
          setIsLoading(false);
          setMessage("");
        }),
    3000
  );
}

function LineNotify() {
  const [message, setMessage] = useState("");
  const [exMsg, setExMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendMessage() {
    if (message.trim()) {
      setIsLoading(true);
      await sendMessage(message, setIsLoading, setMessage, setExMsg);
    } else {
      alert("ยังไม่ได้ใส่ข้อความ");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <label className="text-line">LINE Notify</label>
        <textarea
          type="text"
          className="text-area-noti"
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <button
          disabled={isLoading}
          onClick={handleSendMessage}
          className="btn-send"
        >
          {isLoading ? "กำลังส่งข้อความ" : "แจ้งเตือน"}
        </button>
        {exMsg && (
          <div className="container-chat">
            <img alt="" src={lineNoti} className="img-logo" />
            <div className="chat-box">{exMsg}</div>
          </div>
        )}
      </header>
    </div>
  );
}

function InputText({ label, type, placeholder, value, onChange }) {
  return (
    <div className="container-input-text">
      <label className="label-input">{label}</label>
      <input
        type={type}
        className="input-text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [pin, setPIN] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("FIRST");

  function nextStepOTP() {
    const re = /^0[0-9]{9}/g;
    const checkPhone = re.test(phone);
    if (name) {
      if (checkPhone) {
        setStatus("VERIFY");
      } else {
        alert(
          "อนุญาตให้กรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลักที่ขึ้นต้นด้วย 0 เท่านั้น"
        );
      }
    } else {
      alert("กรุณากรอกข้อมูลให้ครบ");
    }
  }

  const nextStepPIN = () => {
    if (otp === "102938") {
      setStatus("SETUP");
    } else {
      setOTP(null);
    }
  };

  function nextStepConfirm() {
    if (pin) {
      setStatus("CONFIRM");
    }
  }

  function nextStepSummary(params) {
    if (pin === confirm) {
      setStatus("SUMMARY");
    } else {
      setConfirm(null);
      alert("PIN ไม่ตรงกัน กรุณาลองอีกครั้ง");
    }
  }

  function manageContent() {
    switch (status) {
      case "FIRST":
        return {
          component: renderFirstStep(),
          action: () => nextStepOTP(),
          isDisabled: () => !(name && phone)
        };

      case "VERIFY":
        return {
          component: renderVerifyOTPStep(),
          action: () => nextStepPIN(),
          isDisabled: () => !(otp.length > 5)
        };

      case "SETUP":
        return {
          component: renderSetupPIN(),
          action: () => nextStepConfirm(),
          isDisabled: () => !(pin.length > 5)
        };

      case "CONFIRM":
        return {
          component: renderConfirmPIN(),
          action: () => nextStepSummary(),
          isDisabled: () => !(confirm.length > 5)
        };

      case "SUMMARY":
        return {
          component: renderSummary(),
          action: () => {}
        };

      default:
        break;
    }
  }

  function renderSummary() {
    return (
      <div className="container-summary">
        <div className="summary-header-text">ข้อมูลสมาชิก</div>
        <div className="summary-text">ชื่อ - นามสกุล: {name}</div>
        <div className="summary-text">หมายเลขโทรศัพท์: {phone}</div>
        <div className="summary-text">PIN: {pin}</div>
      </div>
    );
  }

  function renderConfirmPIN() {
    return (
      <Fragment>
        <div className="header-text">ตั้ง PIN</div>
        <div className="pin-text">ระบุอีกครั้ง</div>
        <OTPInput
          className="container-otp"
          inputClassName="input-otp"
          value={confirm}
          onChange={setConfirm}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={false}
        />
      </Fragment>
    );
  }

  function renderSetupPIN() {
    return (
      <Fragment>
        <div className="header-text">ตั้ง PIN</div>
        <div className="pin-text">เพื่อใช้ยืนยันตัวตนในครั้งต่อไป</div>
        <OTPInput
          className="container-otp"
          inputClassName="input-otp"
          value={pin}
          onChange={setPIN}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={false}
        />
      </Fragment>
    );
  }

  function renderVerifyOTPStep() {
    return (
      <Fragment>
        <div className="header-text">ยืนยัน OTP</div>
        <div className="title-text">ของหมายเลข {phone}</div>
        <div className="label-otp">กรุณาระบุ OTP</div>
        <OTPInput
          className="container-otp"
          inputClassName="input-otp"
          value={otp}
          onChange={setOTP}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={false}
        />
      </Fragment>
    );
  }

  function renderFirstStep() {
    return (
      <Fragment>
        <div className="header-text">ยืนยันตัวตน</div>
        <div className="title-text">เพื่อความถูกต้องของข้อมูล</div>
        <InputText
          label="ชื่อ นามสกุล*"
          type="text"
          placeholder="ชื่อ นามสกุล"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <InputText
          label="เบอร์โทรศัพท์*"
          type="text"
          placeholder="เบอร์โทรศัพท์"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </Fragment>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="content">{manageContent().component}</div>
          {status !== "SUMMARY" && (
            <button
              className="btn-next"
              onClick={manageContent().action}
              disabled={manageContent().isDisabled()}
            >
              ต่อไป
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
