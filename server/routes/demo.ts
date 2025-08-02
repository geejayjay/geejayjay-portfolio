import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";

// for future use.
export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "GeeJayJay Portfolio API: Not Implemented Yet",
  };
  res.status(200).json(response);
};
