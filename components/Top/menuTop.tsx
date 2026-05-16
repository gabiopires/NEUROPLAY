import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface DataMenu{
  perfilProf?: boolean,
  perfilStud?: boolean
}

export default function MenuTop(props: DataMenu){

  const [seeOptionsProf, setSeeOptionsProf] = useState(false)
  const [seeOptionsStu, setSeeOptionsStu] = useState(false)
  const [imgLogo, setImgLogo] = useState("")
  const [seeMenuDropDown, setSeeMenuDropDown] = useState("")
  const router = useRouter();

  useEffect(() => {
    if(props.perfilProf == true){
      setSeeOptionsProf(true)
      setImgLogo("logoimgOptions")
    }else if (props.perfilStud == true){
      setSeeOptionsStu(true)
      setImgLogo("logoimgOptions")
    }else{
      setImgLogo("logoimg")
    }
  }, [props.perfilProf, props.perfilStud])

  function seeMenu(){
    if(seeMenuDropDown == ""){
      setSeeMenuDropDown("Select")
    }else{
      setSeeMenuDropDown("")
    }
  }

  return (
    <div className="menuTop">
      <div className="menuBox">
          <div className="textLogo">
              <h1 className="textLogoNeuro">Neuro</h1>
              <h1 className="textLogoPlay">Play</h1>
          </div>
          <div className="BoximageLogo">
            <Image src="/images/logo.jpeg" alt="logo" width={70} height={65} className={imgLogo}/>
            {seeOptionsStu &&
              <>
                <Image src="/images/menu.svg" alt="logo" width={30} height={30} className="optionsImg" onClick={()=>{seeMenu()}}/>
                <div className={`MenuDropDown${seeMenuDropDown}`}>
                  {seeMenuDropDown == "Select" ?
                    <>
                      <h1 className="optionSelect" onClick={()=>router.push("/home/homeStudent")}>Niveis</h1>
                      <h1 className="optionSelect" onClick={()=>router.push("/profile/profileStudent")}>Perfil</h1>
                      <h1 className="optionSelect" onClick={()=>router.push("/stamp")}>Selos</h1>
                      <h1 className="optionSelect" onClick={()=>router.push("/")}>Sair</h1>
                    </>:""
                    }
                </div>
              </>}
              {seeOptionsProf &&
                <>
                  <Image src="/images/menu.svg" alt="logo" width={30} height={30} className="optionsImg" onClick={()=>{seeMenu()}}/>
                  <div className={`MenuDropDown${seeMenuDropDown}`}>
                  {seeMenuDropDown == "Select" ?
                    <>
                      <h1 className="optionSelect" onClick={()=>router.push("/home/homeProfessional")}>Home</h1>
                      <h1 className="optionSelect" onClick={()=>router.push("/profile/profileProf")}>Perfil</h1>
                      <h1 className="optionSelect" onClick={()=>router.push("/")}>Sair</h1>
                    </>:""
                  }
                  </div>
                </>}
          </div>
      </div>
    </div>
  );
}