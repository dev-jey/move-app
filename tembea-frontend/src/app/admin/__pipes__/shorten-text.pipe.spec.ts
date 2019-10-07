import { ShortenTextPipe } from './shorten-text.pipe';

describe('ShortenTextPipe', () => {
  let pipe: ShortenTextPipe;
  beforeEach(() => {
    pipe = new ShortenTextPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should shorten the text', () => {
    const newText = pipe.transform('Winterfell', 6);
    expect(newText).toEqual('Winter...');
  });

  it('should return the original text if text length does not exceed the max', () => {
    const newText = pipe.transform('Arya');
    expect(newText).toEqual('Arya');
  });
});
