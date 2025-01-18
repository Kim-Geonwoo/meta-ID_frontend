import React from "react";
import Link from 'next/link';
import { Button, Pagination, PaginationItemRenderProps } from "@heroui/react";

const PageBar = () => {
  const renderPaginationItem = (props: PaginationItemRenderProps) => {
    const { value, isActive, setPage } = props;
    let href = '/';
    let text = '';
    switch (value) {
      case 1:
        href = '/';
        text = '홈';
        break;
      case 2:
        href = '/createServices';
        text = '서비스 생성';
        break;
      case 3:
        href = '/myServices';
        text = '나의 서비스들';
        break;
      case 4:
        href = '/updates';
        text = '업데이트';
        break;
      case 5:
        href = '/about';
        text = '소개';
        break;
      default:
        href = '/';
        text = '홈';
    }

    return (
        <Button color="primary" variant="bordered" className={`p-2 ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
            <Link href={href} key={value}>
            <p
                onClick={() => setPage(Number(value))}
            >
                {text}
            </p>
            </Link>
        </Button>
    );
  };

  return (
    <div className="flex gap-4 p-4 bg-black">
      <Pagination initialPage={1} total={5} renderItem={renderPaginationItem} variant="bordered" />
    </div>
  );
};

export default PageBar;