import { is_eoa_active } from "../utils/accountclassify"

it('Is active address', async () => {
    const address = "0x1291Ef896d428eb43d2c38841eb1bb3f74Ea8b4B"; 
    expect(await is_eoa_active(address)).toBe(true); // Adjust expected result based on your testing data
});

it('Is active address', async () => {
    const address = "0xafd99a1a7e2195a8E0fdB6e8bD45EFDff15FEadD"; 
    expect(await is_eoa_active(address)).toBe(true); // Adjust expected result based on your testing data
});
