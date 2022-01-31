import { Request, Response } from 'express';

export default function errorHandler(error: Error, res: Response) {
  if (error instanceof ResourceNotFoundError) {
    res.status(404);
    res.send(error.message);
  } else {
    console.trace(error);
    res.status(500);
    res.send('An unknown error occured.');
  }
}

export class ResourceNotFoundError extends Error {
  constructor(message: string, resourceID: string) {
    super(message);
  }
}
