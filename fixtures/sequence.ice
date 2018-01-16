#pragma once

module A {
    struct Struct {};

    sequence   <Struct> StructSeq;
    sequence
    <Struct> StructSeq2;
    sequence	<Struct> StructSeq3; // there is a tab between `sequence` and `<`
    sequence<Struct> StructSeq4;
};
