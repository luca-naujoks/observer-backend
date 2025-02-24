import { Injectable } from '@nestjs/common';

@Injectable()
export class TmdbApiValidator {
  static async isValidTmdbAPIKey(api_key: string): Promise<boolean> {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`,
      },
    };

    try {
      const response = await fetch('https://api.themoviedb.org/3/authentication', options);
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to validate the TMDB API key:', error);
      return false;
    }
  }
}