export default function PingPage() {
  return (
    <div style={{ padding: 50, fontFamily: 'system-ui' }}>
      <h1>Pong!</h1>
      <p>The application is routing correctly.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
