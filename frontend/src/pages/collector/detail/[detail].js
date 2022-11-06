import Image from "next/image";
import { Header } from "@/components/layout/header";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const detail = () => {
  const router = useRouter();
  const [detail, setDetail] = useState(0);
  console.dir(router.query.detail);

  // この部分を追加
  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setDetail(Number(router.query.detail));
    }
  }, [router]);

  useEffect(() => {
    if (detail) {
      console.dir(detail);
    }
  }, [detail]);

  return (
    <>
      <div className="flex flex-col items-center p-2"></div>
    </>
  );
};

export default detail;
