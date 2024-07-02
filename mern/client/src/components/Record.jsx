import { Radio } from "antd";
import { useState } from "react";
import Starter from "../components/Starter";
import InputFields from "../organisms/InputDB";
export default function Record() {

  const [value, setValue] = useState(1);  // Default selected value


  const BoxedRadioButtons = () => {
  
    const onChange = e => {
      console.log('radio checked', e.target.value);
      setValue(e.target.value);
    };
  
    return (
      <Radio.Group onChange={onChange} value={value} style={{ display: 'flex', margin: '20px 0 20px 0', justifyContent: 'center', gap: '5%' }}>
        <Radio.Button value={1} style={{fontSize: 'large' }}>Update Flow</Radio.Button>
        <Radio.Button value={2} style={{fontSize: 'large' }}>Insert Flow</Radio.Button>
      </Radio.Group>
    );
  };
  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Shipping Records</h3>
      <div className="sm:col-span-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-slate-900"
        >
          <BoxedRadioButtons />
        </label>


        {value === 1 ? <Starter dbFlow={true} /> : <InputFields />}
      </div>
    </>
  );
}
