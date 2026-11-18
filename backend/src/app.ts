import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { AppError } from './errors';
import { progressRouter } from './routes/progressRoutes';

//TODO extract routes into routing file
//TODO extract error middleware into own file
//TODO create server loader file where all middleware, CORS, rate limitir, routes and error handling are loaded
//TODO streamline app file into initiating the server only and connecting to external Data sources

declare module 'express-serve-static-core' {
  interface Request {
    /**
     * Fictional stand-in for what real auth middleware would set from a
     * verified session/JWT — never trust the `:learnerId` route param for
     * access control on its own. Undefined unless the
     * `x-authenticated-learner-id` header is sent; this starter does not
     * enforce it (see the comment in progressRoutes.ts).
     */
    authenticatedLearnerId?: number;
  }
}

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Populate the fictional identity stub; this does not authenticate the caller.
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const header = req.header('x-authenticated-learner-id');
    if (header !== undefined) {
      req.authenticatedLearnerId = Number(header);
    }
    next();
  });

  // server health endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', progressRouter);

  // not found middleware
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // global error handling middleware
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    // Express can reject malformed input before the route's validation runs.
    if (err instanceof URIError && 'status' in err && err.status === 400) {
      res.status(400).json({ error: 'Invalid URL encoding' });
      return;
    }

    if (
      err instanceof SyntaxError
      && 'status' in err && err.status === 400
      && 'type' in err && err.type === 'entity.parse.failed'
    ) {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
