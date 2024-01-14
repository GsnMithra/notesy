"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";

import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Bubble from "@/user-components/bubble";

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/board");
        setUser(user);
      } else {
        setUser(null);
        setShowPage(true);
      }
    });
  })

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [modeSignIn, setModeSignIn] = useState(false);
  const handleLoginButton = async (u: string, p: string) => {
    if (u === "" || p === "") {
      setAlertTitle("Error");
      setAlertDetails("Please fill in all fields");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3500);
      return;
    }

    await login(u, p);
  };

  const providerSignIn = async (provider: any) => {
    signInWithPopup(auth, provider).then((result) => {
      const credential = provider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      setAlertTitle("Success");
      setAlertDetails("Logged in successfully");
      setShowAlert(true);
      setTimeout(() => {
        router.push("/board");
        setShowAlert(false);
        setLoading(false);
      }, 1000)
    }).catch((error) => {
      const errorMessage = error.message;
      setAlertTitle("Error");
      setAlertDetails(errorMessage);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3500)
    })
  }

  const login = async (e: string, p: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, e, p)
      .then((userCredential) => {
        const user = userCredential.user;
        setAlertTitle("Success");
        setAlertDetails("Logged in successfully");
        setShowAlert(true);
        setTimeout(() => {
          router.push("/board");
          setShowAlert(false);
          setLoading(false);
        }, 1000)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setAlertTitle("Error");
        setAlertDetails(errorMessage);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setLoading(false);
        }, 3500)
      });
  }

  const signup = async (e: string, p: string) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, e, p)
      .then((userCredential) => {
        const user = userCredential.user;
        setAlertTitle("Success");
        setAlertDetails("Account created successfully");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setModeSignIn(false);
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setLoading(false);
        }, 2000)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setAlertTitle("Error");
        setAlertDetails(errorMessage);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setLoading(false);
        }, 3500)
      });
  }

  const handleSignIn = async (e: string, p: string, c: string) => {
    if (e === "" || p === "" || c === "") {
      setAlertTitle("Error");
      setAlertDetails("Please fill in all fields");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3500);
      return;
    }

    if (p !== c) {
      setAlertTitle("Error");
      setAlertDetails("Passwords do not match");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3500);
      return;
    }

    await signup (e, p)
  }

  if (!showPage) {
    return (
      <main className={`flex h-screen w-screen items-center justify-center`}>
        <Spinner size="lg" />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute left-[30%] top-1/2">
        <Bubble size={100}/>
      </div>
      <div className="absolute right-[20%] top-[10%]">
        <Bubble size={60}/>
      </div>
      <div className="absolute right-[20%] bottom-[20%]">
        <Bubble size={80}/>
      </div>
      {showAlert && <Alert variant={alertTitle === "Error" ? "destructive" : "default"} className="absolute bottom-5 left-50 w-52">
        <AlertTitle>{alertTitle}</AlertTitle>
        <AlertDescription>
          {alertDetails}
        </AlertDescription>
      </Alert>}
      {modeSignIn && (
        <Card className="max-w-[400px] p-3 gap-3 z-10">
          <CardHeader className="flex gap-3">
            <h1 className="text-7xl font-bold">noʊtsi</h1>
          </CardHeader>
          <Divider />
          <CardBody className="flex gap-3 items-center justify-center z-1">
            <Input
              type="email"
              label="Email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              label="Confirm Password"
              variant="bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex flex-row gap-3 mt-3 mb-3">
              <Button variant="flat" onPress={() => setModeSignIn(false)}>
                Back
              </Button>
              <Button color="primary" onPress={() => handleSignIn(email, password, confirmPassword)} isLoading={loading ? true : false}>
                Create Account
              </Button>
            </div>
          </CardBody>
          <Divider className="m-1 w-auto" />
          <CardFooter className="flex flex-row gap-3 items-center justify-center">
            <Button
              variant="flat"
              color="primary"
              isIconOnly
              style={{ height: "60px", width: "60px" }}
            >
              <Image
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google"
                height={35}
                width={35}
              />
            </Button>
            <Button
              variant="flat"
              color="primary"
              isIconOnly
              style={{ height: "60px", width: "60px" }}
            >
              <Image
                src="https://authjs.dev/img/providers/github.svg"
                alt="Facebook"
                height={40}
                width={40}
              />
            </Button>
            <Button
              variant="flat"
              color="primary"
              isIconOnly
              style={{ height: "60px", width: "60px" }}
            >
              <Image
                src="https://authjs.dev/img/providers/twitter.svg"
                alt="Github"
                height={40}
                width={40}
              />
            </Button>
          </CardFooter>
        </Card>
      )}
      {!modeSignIn && (
        <Card className="max-w-[400px] p-3 gap-3 z-10">
          <CardHeader className="flex gap-3">
            <h1 className="text-7xl font-bold">noʊtsi</h1>
          </CardHeader>
          <Divider />
          <CardBody className="flex gap-3 items-center justify-center">
            <Input
              type="email"
              label="Email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-row gap-3 mt-3">
              <Button variant="flat" onPress={() => setModeSignIn(true)}>
                Sign up
              </Button>
              <Button
                color="primary"
                onPress={() => handleLoginButton(email, password)}
                isLoading={loading ? true : false}
              >
                Login
              </Button>
            </div>
          </CardBody>
          <Divider className="m-1 w-auto" />
          <CardFooter className="flex flex-row gap-3 items-center justify-center">
            <div className="flex text-sm">
              Sign in with 
            </div>
            <Button
              // variant="flat"
              color="primary"
              isIconOnly
              style={{ height: "60px", width: "60px" }}
              className="flex items-center justify-center"
              onPress={() => {providerSignIn(googleProvider)}}
            >
              <Image
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google"
                height={35}
                width={35}
              />
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
