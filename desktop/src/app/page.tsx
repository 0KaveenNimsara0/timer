import Timer from "@/components/Timer";

export default function Home() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '40px' }}>
      <Timer />
    </div>
  );
}
