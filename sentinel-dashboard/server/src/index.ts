import { createServer } from 'http';
import app from './app';
import { wsService, chainSimulator } from './context';

const server = createServer(app);
const PORT = process.env.PORT || 3001;

wsService.attach(server);


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  chainSimulator.start();
});
