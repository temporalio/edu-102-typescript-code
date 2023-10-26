import { URLSearchParams } from 'url';
import fetch from "node-fetch";

export async function estimateAge(name: string): Promise<number> {
  const base = 'https://api.agify.io/?';
  const url = base + new URLSearchParams({ name });

  const response = await fetch(url).then(res => res.json())

  interface EstimatorResponse {
    age: number;
    count: number;
    name: string;
  }

  const parsedResponse = response as EstimatorResponse;
  return parsedResponse.age;
}
