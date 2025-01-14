import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { R2Client } from './lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const JSONEditor = dynamic(() => import('react-json-editor-ajrm'), { ssr: false });
import locale from 'react-json-editor-ajrm/locale/en';

const Test = () => {
  const router = useRouter();
  const { shortUrl } = router.query;
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const command = new GetObjectCommand({
          Bucket: "meta-id",
          Key: `c8p1ea/data.json`,
        });
        const data = await R2Client.send(command);
        const bodyContents = await data.Body.transformToByteArray();
        const json = new TextDecoder().decode(bodyContents);
        setJsonData(JSON.parse(json));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shortUrl) {
      fetchData();
    }
  }, [shortUrl]);

  const handleSave = async () => {
    // 저장 로직 구현
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;

  return (
    <div>
      <h1>서비스 수정: {shortUrl}</h1>
      {jsonData && (
        <JSONEditor
          placeholder={jsonData}
          onChange={(e: { json: any }) => setJsonData(e.json)}
          locale={locale}
        />
      )}
      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default Test;
