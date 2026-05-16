import Image from "next/image";
import { useRouter } from "next/router";

export default function Home(){

  const router = useRouter()

  return (
    <div className="homePage">
      <div className="homePageLogo">
        <div className="homePageLogoBoxImg">
          <Image className="homePageLogoImg" alt="logo" height={100} width={100} src={"/images/logo.jpeg"}/>
        </div>
        <div className="LogoBoxImgTextLogo">
          <h1 className="textNeuro">Neuro</h1>
          <h1 className="textPlay">Play</h1>
        </div>
        <h1 className="textExplicationLogo">Uma aplicação interativa</h1>
      </div>
      <div className="homePageSignIn">
        <h1 className="textAprender">Ensinando crianças a ler</h1>
        <div className="signInButton">
            <button className="buttonCadastrar" onClick={()=> router.push("/register")}>Cadastrar</button>
            <button className="buttonTenhoConta" onClick={()=> router.push("/login")}>Já tenho uma conta</button>
        </div>
      </div>
    </div>
  );
}