import { ConvertNullValue } from './convert-nullValue.pipe';


describe('ConvertNullValue', () => {
    let pipe: ConvertNullValue;

    beforeEach(() => {
        pipe = new ConvertNullValue();
    });
    it('should create an instance of pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return value if not null', () => {
        const result = pipe.transform('hello');
        expect(result).toBe('hello');
    });

    it('should return provided default if value is null', () => {
        const result = pipe.transform(null, 'NA');
        expect(result).toBe('NA');
    });
});
