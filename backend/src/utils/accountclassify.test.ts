import { is_eoa } from './accountclassify';
import { getAlchemyAPI } from 'src/configs/provider.configs';

jest.mock('src/configs/provider.configs', () => ({
  getAlchemyAPI: jest.fn()
}));

describe('is_eoa', () => {
  const mockAlchemy = {
    core: {
      getCode: jest.fn()
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAlchemyAPI as jest.Mock).mockReturnValue(mockAlchemy);
  });

  it('should return true for an externally owned account (EOA)', async () => {
    const address = '0xb1b2d032AA2F52347fbcfd08E5C3Cc55216E8404';
    mockAlchemy.core.getCode.mockResolvedValue('0x');

    const result = await is_eoa(address);

    expect(result).toBe(true);
    expect(mockAlchemy.core.getCode).toHaveBeenCalledWith(address);
  });

  it('should return false for a contract address', async () => {
    const address = '0x156ACd2bc5fC336D59BAAE602a2BD9b5e20D6672';
    mockAlchemy.core.getCode.mockResolvedValue('0x1234');

    const result = await is_eoa(address);

    expect(result).toBe(false);
    expect(mockAlchemy.core.getCode).toHaveBeenCalledWith(address);
  });
});
