import MenuTop from "../../../components/Top/menuTop";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { TypeDataAlerts } from "../../../components/type";
import Alerts from "../../../components/alerts/alerts";
import FaceId from "../../../components/registerFaceId/faceId"; // <-- Importado o componente
import path from "path";

let dataAlerts: TypeDataAlerts = {
  alertType: 0,
  alertText: "",
  alertButtons: [],
  alertsCommans: [],
};

export default function ProfileStudent() { 
  const [showAlerts, setshowAlerts] = useState(false);
  const [showFaceId, setshowFaceId] = useState(false); 
  const [messagePassword, setMessagePassword] = useState("");
  const inputAddImg = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState("");
  const [editInfo, setEditInfo] = useState(false);
  const [stuId, setStuId] = useState(0);
  const [nameStudent, setNameStudent] = useState("");
  const [userStudent, setUserStudent] = useState("");
  const [passwordStudent, setPasswordStudent] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileImgProfile, setFileImgProfile] = useState<any>(null);
  const [nameImgProfile, setNameImgProfile] = useState("");
  const [faceIdStudent, setFaceIdStudent] = useState(false);
  const [editUserStudent, setEditUserStudent] = useState("");
  const [editPasswordStudent, setEditPasswordStudent] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      getDataStudent(storedId);
    }
  }, [editInfo]);

  async function getDataStudent(idStu: string) {
    try {
      const endpoint = `/api/apiProfileStudent?idStudent=${idStu}&action=getDataStudent`;
      const response = await fetch(endpoint, { method: "GET", cache: "reload" });
      const data = await response.json();
      if (response.status === 200) {
        setNameStudent(data.stu_name);
        setUserStudent(data.stu_user);
        setEditUserStudent(data.stu_user);
        setStuId(data.stu_id);
        setPasswordStudent(data.stu_password);
        setEditPasswordStudent(data.stu_password);
        setProfileImage(data.stu_profileImage);
        setFaceIdStudent(data.stu_faceId != null && data.stu_faceId !== "" ? true : false);
      } else {
        setshowAlerts(true);
        dataAlerts = {
          alertType: 5,
          alertText: "Erro ao carregar dados, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [() => setshowAlerts(false)],
        };
      }
    } catch (error) {
      console.error("Error parsing response:", error);
    }
  }

  const checkPasswordMatch = (password: string) => {
    if (password.length < 8) {
      setMessagePassword("❌ Digite pelo menos 8 caracteres!");
    } else {
      setMessagePassword("✔ Senha válida");
    }
  };

  function AuthenticationsAlerts() {
    if (
      editUserStudent == "" ||
      editUserStudent.toLowerCase() === "null"
    ) {
      setEditUserStudent(userStudent);
      setshowAlerts(true);
      dataAlerts = {
        alertType: 5,
        alertText: "Insira um valor válido para o Usuário",
        alertButtons: ["Editar"],
        alertsCommans: [() => {setshowAlerts(false);setEditInfo(false);}],
      };
    } else if (editPasswordStudent == "") {
      setEditPasswordStudent(passwordStudent);
      setshowAlerts(true);
      dataAlerts = {
        alertType: 2,
        alertText: "Cadastre uma senha",
        alertButtons: ["Editar"],
        alertsCommans: [() => setshowAlerts(false)],
      };
    } else if (editPasswordStudent.length < 8) {
      setEditPasswordStudent(passwordStudent);
      setshowAlerts(true);
      dataAlerts = {
        alertType: 2,
        alertText: "A senha deve conter pelo menos 8 caracteres",
        alertButtons: ["Editar"],
        alertsCommans: [() => setshowAlerts(false)],
      };
    } else {
      saveDataStudent(stuId);
    }
  }

  async function saveDataStudent(idStudent: number) {
    const resImg = await uploadImage(fileImgProfile, nameImgProfile);
    if (resImg === 200) {
      try {
        const endpoint = `/api/apiProfileStudent?idStudent=${idStudent}&userStudent=${editUserStudent}&passwordStudent=${editPasswordStudent}&profileImage=${nameImgProfile}&action=saveDataStudentPhoto`;
        const response = await fetch(endpoint, { method: "POST", cache: "reload" });
        if (response.status === 200) {
          setshowAlerts(true);
          dataAlerts = {
            alertType: 3,
            alertText: "Dados salvos com sucesso!",
            alertButtons: ["Ok"],
            alertsCommans: [() => {setshowAlerts(false);setEditInfo(false);}],
          };
          setProfileImage(nameImgProfile);
          getDataStudent(`${idStudent}`)
        }else{
          setshowAlerts(true);
          dataAlerts = {
            alertType: 5,
            alertText: "Erro ao salvar dados, tente novamente mais tarde",
            alertButtons: ["Ok"],
            alertsCommans: [() => {setshowAlerts(false);setEditInfo(false);}],
          };
        }
      }catch (error){
        console.error("Error parsing response:", error);
      }
    }else{
      try{
        const endpoint = `/api/apiProfileStudent?idStudent=${idStudent}&userStudent=${editUserStudent}&passwordStudent=${editPasswordStudent}&action=saveDataStudent`;
        const response = await fetch(endpoint, { method: "POST", cache: "reload" });
        if (response.status === 200) {
          setshowAlerts(true);
          dataAlerts = {
            alertType: 3,
            alertText: "Dados salvos com sucesso!",
            alertButtons: ["Ok"],
            alertsCommans: [() => {setshowAlerts(false);setEditInfo(false);}],
          };
          getDataStudent(`${idStudent}`)
        }else{
          setshowAlerts(true);
          dataAlerts = {
            alertType: 5,
            alertText: "Erro ao salvar dados, tente novamente mais tarde",
            alertButtons: ["Ok"],
            alertsCommans: [() => {setshowAlerts(false);setEditInfo(false);}],
          };
        }
      }catch (error) {
        console.error("Error parsing response:", error);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addImgIcon = (evt: any) => {
    const name = nameStudent.replaceAll(" ", "");
    const docfiles = evt.target.files[0];
    const nameImgAdd = docfiles.name;
    const fileExtension = path.extname(nameImgAdd);
    const newName = `${name}${stuId}${fileExtension}`;
    setNameImgProfile(newName);
    setFileImgProfile(docfiles);
  };

  async function uploadImage(image: File, nameImage: string) {
    const formData = new FormData();
    if (image) {
      formData.append("file", image);
      formData.append("name_file", nameImage);
      try {
        const response = await fetch("/api/apiUploadImage", {
          method: "POST",
          body: formData,
        });
        try {
          return response.status;
        } catch (error) {
          return error;
        }
      } catch (error) {
        console.error("Falha no upload:", error);
        return error;
      }
    }
  }

  const imageSource = (!profileImage || profileImage === "null" || profileImage === "undefined")
  ? "/images/account_circle.svg"
  : `/uploads/${profileImage}`;

  function handleFaceIdSuccess() {
    setshowFaceId(false);
    getDataStudent(`${stuId}`);
  }

  async function resetFaceId() {
    try {
      const endpoint = `/api/apiProfileStudent?idStudent=${stuId}&action=deleteFaceId`;
      const response = await fetch(endpoint, { method: "PATCH", cache: "reload" });
      if (response.status === 200) {
        setshowAlerts(true);
        dataAlerts = {
          alertType: 3,
          alertText: "Face Id removido com sucesso!",
          alertButtons: ["Ok"],
          alertsCommans: [() => { setshowAlerts(false); setEditInfo(false); }]
        };
        getDataStudent(`${stuId}`);
      } else {
        setshowAlerts(true);
        dataAlerts = {
          alertType: 5,
          alertText: "Erro ao remover Face Id, tente novamente mais tarde",
          alertButtons: ["Ok"],
          alertsCommans: [() => { setshowAlerts(false); setEditInfo(false); }]
        };
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      setshowAlerts(true);
      dataAlerts = {
        alertType: 5,
        alertText: "Erro ao remover Face Id, tente novamente mais tarde",
        alertButtons: ["Ok"],
        alertsCommans: [() => { setshowAlerts(false); setEditInfo(false); }]
      };
    }
  }

  function aceptTermos(){
    setshowAlerts(true);
    dataAlerts = {
      alertType: 5,
      alertText: "Ao prosseguir, declaro que li e concordo com os Termos de Uso e a Política de Privacidade, autorizando a coleta, armazenamento e tratamento dos meus dados biométricos faciais para fins de autenticação e identificação no sistema, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).",
      alertButtons: ["Concordo com os termos", 'Não concordo'],
      alertsCommans: [() => { setshowAlerts(false); showCompFaceId() }, () => setshowAlerts(false)]
    }
  }

  function showCompFaceId(){
    setshowFaceId(true);
  }

  return (
    <div className="bodyProfileProf">
      {showAlerts && <Alerts dataAlert={dataAlerts} />}
      {showFaceId && (<FaceId userType="student" id={stuId} comandFaceId={() => {setshowFaceId(false)}} onSuccess={handleFaceIdSuccess}/>)}

      <div>
        <MenuTop perfilProf={false} perfilStud={true} />
      </div>
      <div className="profileProfArea">
        <div className="profileProfBox">
          <div className="profileProfImg">
            {editInfo === false ? 
              (<div className="professionalImgBox"><Image className="professionalImg" alt="" height={100} width={100} src={imageSource}/></div>) : 
              (<input ref={inputAddImg} type="file" className="inputAddImage" accept=".svg, .png, .jpeg" onChange={(evt) => addImgIcon(evt)}/>)
            }
          </div>
          <div className="profileProfContent">
            <div className="profileProfDesc">
              <h1>Nome:</h1>
              <h1>{nameStudent}</h1>
            </div>
          </div>
          <div className="profileProfContent">
            <div className="profileProfDesc">
              <h1>Usuário:</h1>
              {editInfo === false ? (
                <h1>{userStudent}</h1>
              ) : (
                <input className="profileProfessionalInput" placeholder={userStudent} value={editUserStudent} onChange={(evt) => setEditUserStudent(evt.target.value)} />
              )}
            </div>
          </div>
          <div className="profileProfContent">
            <div className="profileProfDesc">
              <h1>Senha:</h1>
              {editInfo === false ? (
                <h1>********</h1>
              ) : (
                <input type={hidePassword ? "password" : "text"} className="profileProfessionalInput" placeholder={passwordStudent} value={editPasswordStudent} onChange={(evt) => { setEditPasswordStudent(evt.target.value);checkPasswordMatch(evt.target.value);}}/>
              )}
              {editInfo === true ? (
                <span onClick={() => setHidePassword(!hidePassword)} style={{ cursor: "pointer" }}>
                  <Image alt="" className="redefinePasswordImage" height={100} width={100} src={hidePassword ? "/images/visibility_off.svg" : "/images/visibility.svg"} />
                </span>
              ) : ("")}
            </div>
            {editInfo === true ? (
              <h1 className="textMessageValidatedPasswordTeacher" style={{ color: editPasswordStudent.length < 8 ? "red" : "green" }} >
                {messagePassword}
              </h1>
            ) : ( "" )}
          </div>
          <div className="profileProfContent">
            <div className="profileProfDesc">
              <h1>Face ID:</h1>
              {editInfo === false ? (
                <h1>{faceIdStudent ? "Ativado" : "Desativado"}</h1>
              ) : (
                <div className="profileFaceInline">
                  {faceIdStudent === true ? (
                    <h1>Ativado</h1>
                  ) : (
                    <h1>Desativado</h1>
                  )}
                </div>
              )}
            </div>
          </div>
          {editInfo != false && faceIdStudent === true ? (
            <button onClick={() => resetFaceId()} className="profileProfButton">Remover Face ID</button>
          ) : ("")}
          {editInfo != false && faceIdStudent === false ? (
            <button onClick={() => aceptTermos()} className="profileProfButton">Habilitar Face ID</button>
          ) : ("")}
          <div className="profileProfButtonBox">
            {editInfo === false ? (
              <button onClick={() => setEditInfo(true)} className="profileProfButton">
                Editar informações
              </button>
            ) : (
              <button onClick={() => {setEditInfo(false);AuthenticationsAlerts();setHidePassword(true);}} className="profileProfButton" >
                Salvar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}