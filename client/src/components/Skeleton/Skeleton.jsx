import styles from './Skeleton.module.css'

export function SkeletonBox({ width, height, radius, style }) {
  return (
    <div
      className={styles.skeleton}
      style={{
        width: width || '100%',
        height: height || '1rem',
        borderRadius: radius || '4px',
        ...style,
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <SkeletonBox height="0" style={{ paddingBottom: '133%' }} />
      <div className={styles.cardBody}>
        <SkeletonBox width="60%" height="0.75rem" />
        <SkeletonBox width="40%" height="1rem" style={{ marginTop: '0.5rem' }} />
        <div className={styles.swatches}>
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} width="20px" height="20px" radius="50%" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className={styles.table}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBox key={j} height="0.75rem" width={j === 0 ? '30%' : '60%'} />
          ))}
        </div>
      ))}
    </div>
  )
}
