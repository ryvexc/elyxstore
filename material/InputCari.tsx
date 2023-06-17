import React from "react";
import { getCookies } from "cookies-next";
import { TmpCookiesObj } from "cookies-next/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function InputCari({
  state,
  action,
  method,
  submitEvent,
  lastsearch
}: any): JSX.Element {
  const [userdata, setUserdata]: any = React.useState<TmpCookiesObj>();
  const labelRef: any = React.useRef(null);
  const inputRef: any = React.useRef(null);
  const [options, setOptions] = React.useState([]);

  const handleInputChange = async (e: any) => {
    const inputValue: string = e.target.value;

    await fetch(`/api/dataBarang?barang=${inputValue as string}`)
      .then(response => response.json())
      .then(data => {
        const dataArray = data.map((_data: any) => _data.nama);
        setOptions(dataArray);
      })
      .catch(err => console.error(err));
  }

  return (<>
    <form action='/api/updatelastsearch' method="GET">
      <input type="hidden" name="username" value={userdata?.username} />
      <input type="hidden" name="lastsearch" value={lastsearch} />
    </form>
    <form action={action} method={method}>
      <label htmlFor="cari_value" className="absolute mt-2 ml-2">
        <FontAwesomeIcon icon={faMagnifyingGlass}
          ref={labelRef}
          className="duration-300 text-[#ffffffca]"
        />
      </label>
      <input
        onSubmit={e => submitEvent(e)}
        ref={inputRef}
        type="text"
        name="barang"
        autoComplete="off"
        onChange={e => handleInputChange(e)}
        list="datalist-options"
        className="input-cari"
        placeholder="Cari di Elyx Store"
        onFocus={e => {
          labelRef.current!.style.color = "white";
          inputRef.current!.style.borderColor = "white";
        }}
        onBlur={e => {
          labelRef.current!.style.color = "#ffffffca";
          inputRef.current!.style.borderColor = "#ffffffca";
        }}
      />
      <datalist id="datalist-options">
        {options!.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
    </form>
  </>
  );
}
