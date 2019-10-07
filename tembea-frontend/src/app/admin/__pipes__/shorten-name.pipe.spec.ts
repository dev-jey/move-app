import { ShortenNamePipe } from './shorten-name.pipe';

describe('ShortenNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenNamePipe();
    expect(pipe).toBeTruthy();
  });
  it('should transform name', () => {
    const pipe = new ShortenNamePipe();
   let result = pipe.transform('', { max: 1 });
   expect(result).toEqual('NA');

   result = pipe.transform('AAAAAA', { max: 8 });
   expect(result).toEqual('AAAAAA');

   result = pipe.transform(null, { max: 8, fallbackText: 'yes' });
   expect(result).toEqual('yes');

   result = pipe.transform('AAAAAAAAAA', { max: 8 });
   expect(result).toEqual('AAAAAAAA...');

   result = pipe.transform('AAAAAA BBBBBB', { max: 8 });
   expect(result).toEqual('A.BBBBBB');

   result = pipe.transform('AAAAAA BBBBBB CCCCCCCCCC', { max: 8 });
   expect(result).toEqual('A.B.CCCCC...');
  });
});
