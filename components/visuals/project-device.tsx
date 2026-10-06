import Image from "next/image";
import type { ProjectDevice as DeviceType, ProjectScreenshot } from "@/data/project-showcase";
import styles from "./project-device.module.css";

export function ProjectDevice({ device, image, title }: { device: DeviceType; image: ProjectScreenshot; title: string }) {
  return (
    <div className={styles.device} data-device={device}>
      {device === "browser" && <div className={styles.chrome} aria-hidden="true"><span><i /><i /><i /></span><small>{title} / {image.caption}</small></div>}
      <div className={styles.screen}>
        <Image src={image.src} alt={`${title}: ${image.caption}`} width={image.width} height={image.height}
          sizes={device === "browser" ? "(max-width: 760px) 85vw, 55vw" : "(max-width: 760px) 70vw, 350px"}
          draggable={false} />
      </div>
    </div>
  );
}
