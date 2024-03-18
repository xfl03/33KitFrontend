import dynamic from 'next/dynamic'
export const DynamicEcharts = dynamic(() => import('./echarts'), {
    loading: () => <p>Loading...</p>,
    ssr: false
})
