import axios from "axios";

import { permit } from "../utils/auth";

const fetcher = axios.create({
  baseURL: "http://10.0.36.129:35002/objects"
});

export default function register(app) {
  app.get("/objects", async (req, res) => {
    try {
      const { status, data, headers } = await fetcher.get("");
      return res
        .status(status)
        .set(headers)
        .send(data);
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).send(err.response.data);
      }

      return res.sendStatus(500);
    }
  });

  app.get("/objects/:id", async (req, res) => {
    const id = req.params.id;

    try {
      const { status, data, headers } = await fetcher.get(id);
      return res
        .status(status)
        .set(headers)
        .send(data);
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).send(err.response.data);
      }

      return res.sendStatus(500);
    }
  });

  app.post("/objects", async (req, res) => {
    const body = req.body;

    try {
      const { status, data, headers } = await fetcher.post("", body);
      return res
        .status(status)
        .set(headers)
        .send(data);
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).send(err.response.data);
      }

      return res.sendStatus(500);
    }
  });

  app.delete("/objects/:id", permit("WRITE"), async (req, res) => {
    const id = req.params.id;

    try {
      const { status, data, headers } = await fetcher.delete(id);
      return res
        .status(status)
        .set(headers)
        .send(data);
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).send(err.response.data);
      }

      return res.sendStatus(500);
    }
  });
}
