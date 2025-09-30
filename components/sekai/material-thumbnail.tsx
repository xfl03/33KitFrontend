type MaterialThumbnailProps = {
  materialId: number,
  count?: number,
  size?: number,
}

export default function CardThumbnail({materialId, count = 0, size = 156}: MaterialThumbnailProps) {
  return (<div style={{height: `${size}px`, width: `${size}px`}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156">
      <title>
        {`ID${materialId}`}
      </title>
      <image
          href={`${process.env.NEXT_PUBLIC_ASSET_BASE}startapp/thumbnail/material/material${materialId}.png`}
          x="0"
          y="0" height="152" width="152"/>
      {size > 0 &&
          <text x="97" y="97" width="56" height="56">
            ｘ{size}
          </text>
      }
    </svg>
  </div>)
}
