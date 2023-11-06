import { URLSearchParams } from 'url';
import axios from 'axios';

export async function estimateAge(name: string): Promise<number> {
  const base = 'https://api.agify.io/?';
  const url = base + new URLSearchParams({ name });

  const response = await axios.get(url);
  const responseBody = response.data;

  interface EstimatorResponse {
    age: number;
    count: number;
    name: string;
  }

  const parsedResponse: EstimatorResponse = responseBody as EstimatorResponse;
  return parsedResponse.age;
}
