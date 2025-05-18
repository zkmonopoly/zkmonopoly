interface ErrorProps {
    code: number;
    message: string;
}

export default function Error(props: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">{props.code}</h1>
      <p className="text-lg">{props.message}</p>
    </div>
  );
}