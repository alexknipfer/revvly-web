interface Props {
  topLeftClassName: string;
  topRightClassName: string;
  bottomLeftClassName: string;
  bottomRightClassName: string;
}

export function CornerAccents({
  topLeftClassName,
  topRightClassName,
  bottomLeftClassName,
  bottomRightClassName,
}: Props) {
  return (
    <>
      <div className={`absolute top-0 left-0 ${topLeftClassName}`} />
      <div className={`absolute top-0 right-0 ${topRightClassName}`} />
      <div className={`absolute bottom-0 left-0 ${bottomLeftClassName}`} />
      <div className={`absolute bottom-0 right-0 ${bottomRightClassName}`} />
    </>
  );
}
