const handleDelRow =  (index) => {
     const newData = [...data];
     newData.splice(index, 1);
     setData(newData);
}