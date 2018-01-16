#pragma once

module A {
    struct Struct {};

    dictionary   <string, Struct> StructMap;
    dictionary
    <string, Struct> StructMap2;
    dictionary	<string, Struct> StructMap3; // there is a tab between `dictionary` and `<`
    dictionary<string, Struct> StructMap4;
};
